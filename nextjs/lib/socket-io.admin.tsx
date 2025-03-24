"use client";

import LoadingGradientText from "@/components/ui/loading-gradient-text";
import { env } from "@/env";
import { useAdminUser } from "@/hooks/auth/use-admin.user";
import { auth } from "@/lib/socket-emits/auth";
import { _ } from "@/lib/utils";
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";

type EmitEventData =
  | {
      cmd: Cmd;
      body?: any;
      time?: number;
    }
  | string;
type EmitEventOptions = {
  eventName?: string;
  timeout?: number;
  retryCount?: number;
  maxRetryCount?: number;
};
export type EmitSocketResponse = {
  cmd: string;
  body: any;
  time: number;
  status: boolean;
  statusCode: number;
  message: any;
  data?: any;
};
type UseAdminSocket = {
  socket: Socket;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  emitEvent: (
    data: EmitEventData,
    options?: EmitEventOptions,
  ) => Promise<EmitSocketResponse>;
};

type EmitPromise = {
  options: EmitEventOptions;
  data: EmitEventData;
  resolve: (res: EmitSocketResponse) => void;
  reject: (err?: any) => void;
};

const emitPromises: EmitPromise[] = [];
const defaultEventNameReceive = "receiveCmd";
const defaultEmitEventOptions = {
  eventName: "sendCmd",
  timeout: 1000 * 10, // 10s
  retryCount: 0,
  maxRetryCount: 10,
};

export const useAdminSocket = create<UseAdminSocket>((set, get) => ({
  socket: io(env.NEXT_PUBLIC_SOCKET_IO_ADMIN_URL, {
    transports: ["websocket"],
  }),
  isConnected: false,
  setIsConnected: (isConnected: boolean) => {
    set({ isConnected });
  },
  emitEvent: (data, options) => {
    const _options = { ...defaultEmitEventOptions, ...options };
    return new Promise((resolve, reject) => {
      emitPromises.unshift({
        options: _options,
        data,
        resolve,
        reject,
      });
      emitPromises.length > 10 && emitPromises.pop();
      get().socket.emit(_options.eventName, data);
    });
  },
}));

export const SocketIoAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket, isConnected, setIsConnected } = useAdminSocket();
  const { logout } = useAdminUser();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onError(err: Error) {
      setIsConnected(false);
      console.log("connect_error", err);
    }

    const handleEmitResponseByStatusCode = async (
      emitResponse: EmitSocketResponse,
      emitPromise: EmitPromise,
    ) => {
      const { statusCode } = emitResponse;
      switch (statusCode) {
        case StatusCode.SUCCESS: {
          return emitPromise.resolve(emitResponse);
        }
        case StatusCode.CREATED: {
          return emitPromise.resolve(emitResponse);
        }
        case StatusCode.UPDATE_NEW_PASSWORD: {
          return emitPromise.resolve(emitResponse);
        }
        case StatusCode.TOKEN_EXPIRED: {
          const resHandleRefresh = await auth.handleRefreshToken(socket);
          if (resHandleRefresh.status) {
            return emitEvent(emitPromise.data, emitPromise.options);
          }
          return logout();
        }
        case StatusCode.UNAUTHORIZED: {
          return logout();
        }
        default: {
          return emitPromise.reject(emitResponse);
        }
      }
    };

    function onReceiveCmd(emitResponse: EmitSocketResponse) {
      emitPromises.forEach((emitPromise: EmitPromise) => {
        if (
          _.get(emitPromise, "options.eventName") === Cmd.SET_ONLINE ||
          _.get(emitPromise, "data.cmd") === emitResponse.cmd
        ) {
          handleEmitResponseByStatusCode(emitResponse, emitPromise);
        }
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on(defaultEventNameReceive, onReceiveCmd);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off(defaultEventNameReceive, onReceiveCmd);
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <LoadingGradientText />
      </div>
    );
  }

  return <>{children}</>;
};

export const emitEvent = useAdminSocket.getState().emitEvent;
/**
 * Enum representing the custom status code of a socket response.
 *
 * @enum {number}
 */
export enum StatusCode {
  /**
   * Success, the request was successful.
   */
  SUCCESS = 200,
  /**
   * Created, the request was successful and a new resource was created.
   */
  CREATED = 201,
  /**
   * Update new password, the request was successful and the user updated their password.
   */
  UPDATE_NEW_PASSWORD = 202,
  /**
   * Bad request, an invalid request was made.
   */
  BAD_REQUEST = 400,
  /**
   * Unauthorized, the request was not authenticated or the token is invalid.
   */
  UNAUTHORIZED = 401,
  /**
   * Token expired, the token has expired.
   */
  TOKEN_EXPIRED = 402,
  /**
   * Server is maintenance, the server is currently under maintenance.
   */
  SERVER_IS_MAINTENANCE = 403,
  /**
   * Data invalid, the request data is invalid.
   */
  DATA_INVALID = 404,
  /**
   * Login different device, the user is logged in on a different device.
   */
  LOGIN_DIFFERENT_DEVICE = 405,
  /**
   * Unknown error, an unknown error occurred.
   */
  UNKNOWN_ERROR = 406,
  /**
   * Not exist account, the account does not exist.
   */
  NOT_EXIST_ACCOUNT = 407,
  /**
   * Too many requests, the request limit has been exceeded.
   */
  TOO_MANY_REQUEST = 408,
  /**
   * Account exist, the account already exists and the registration failed.
   */
  ACCOUNT_EXIST = 409,
}

export enum Cmd {
  LOGIN = "login",
  LOGOUT = "logout",
  REGISTER = "register",
  SEND_EMAIL_RESET_PASSWORD = "sendResetPassword",
  CHECK_RESET_PASSWORD_CODE = "checkResetCode",
  RESET_PASSWORD = "updatePassword",
  CHANGE_PASSWORD = "changePassword",
  GET_ME = "getMe",
  SET_ONLINE = "set-online",
  REFRESH_TOKEN = "refreshToken",
  SEARCH_USERS = "searchUsers",
  INSERT_USER = "insertUser",
  UPDATE_USER = "updateUser",
  DELETE_USER = "deleteUser",
  UPDATE_PROFILE = "update_profile",
  INSERT_PERMISSION_TYPE = "insert_permission_type",
  SEARCH_PERMISSION_TYPE = "search_permission_type",
  GET_PERMISSION_TYPE_BY_ID = "get_permission_type",
  UPDATE_PERMISSION_TYPE = "update_permission_type",
  DELETE_PERMISSION_TYPE = "delete_permission_type",
  GET_ALL_PERMISSION_TYPE = "get_all_permission_by_type",
  INSERT_PERMISSION = "insert_permission",
  SEARCH_PERMISSION = "search_permission",
  GET_ALL_PERMISSION = "get_all_permission",
  // GET_PERMISSION_BY_ID = "get_permission",
  UPDATE_PERMISSION = "update_permission",
  DELETE_PERMISSION = "delete_permission",
  INSERT_GROUP_PERMISSION = "insert_group_permission",
  SEARCH_GROUP_PERMISSION = "search_group_permission",
  GET_ALL_GROUP_PERMISSION = "get_all_group_permission",
  // GET_GROUP_PERMISSION_BY_ID = "get_group_permission",
  UPDATE_GROUP_PERMISSION = "update_group_permission",
  DELETE_GROUP_PERMISSION = "delete_group_permission",
  GET_SETTING_OPTIONS = "getOptions",
  UPDATE_SETTING_OPTION = "updateOption",
  SEARCH_CUSTOMER_GROUP = "search_customer_group",
  SEARCH_CUSTOMER = "search_customer",
  GET_ALL_CUSTOMER_GROUP = "get_customer_groups",
  INSERT_CUSTOMER_GROUP = "insert_customer_group",
  UPDATE_CUSTOMER_GROUP = "update_customer_group",
  DELETE_CUSTOMER_GROUP = "delete_customer_group",
  SEARCH_MENU_GROUP = "search_menu_group",
  GET_ALL_MENU_GROUP = "get_menu_groups",
  INSERT_MENU_GROUP = "insert_menu_group",
  UPDATE_MENU_GROUP = "update_menu_group",
  DELETE_MENU_GROUP = "delete_menu_group",
  SEARCH_MENU = "search_menu",
  GET_MENU_BY_ID = "get_menu",
  GET_MENU_PARENT = "get_menu_parent",
  INSERT_MENU = "insert_menu",
  UPDATE_MENU = "update_menu",
  DELETE_MENU = "delete_menu",
  SEARCH_BANNER = "search_banner",
  GET_BANNER_BY_ID = "get_banner",
  INSERT_BANNER = "insert_banner",
  UPDATE_BANNER = "update_banner",
  DELETE_BANNER = "delete_banner",
  SEARCH_LAYOUT = "search_layout",
  GET_LAYOUT_BY_ID = "get_layout",
  GET_LAYOUT_TYPES = "get_layout_types",
  INSERT_LAYOUT = "insert_layout",
  UPDATE_LAYOUT = "update_layout",
  DELETE_LAYOUT = "delete_layout",
  ADD_MODULE_LAYOUT = "add_module_layout",
  DELETE_MODULE_LAYOUT = "delete_module_layout",
  SEARCH_CATEGORY = "search_category",
  GET_CATEGORY_PARENT = "get_category_parent",
  GET_CATEGORY_BY_ID = "get_category",
  GET_ALL_CATEGORIES = "get_categories",
  INSERT_CATEGORY = "insert_category",
  UPDATE_CATEGORY = "update_category",
  DELETE_CATEGORY = "delete_category",
  SEARCH_ARTICLE = "search_article",
  GET_ARTICLE_BY_ID = "get_article",
  GET_ALL_ARTICLES = "get_articles",
  INSERT_ARTICLE = "insert_article",
  UPDATE_ARTICLE = "update_article",
  DELETE_ARTICLE = "delete_article",
  PUBLISH_ARTICLE = "publish_article",
  SEARCH_MODULE = "search_modules",
  GET_ALL_MODULE = "get_modules",
  INSERT_MODULE = "insert_module",
  UPDATE_MODULE = "update_module",
  DELETE_MODULE = "delete_module",
  SEARCH_COUNTRY = "search_country",
  GET_ALL_CONTINENTS = "get_continents",
  GET_ALL_COUNTRY = "get_countries",
  INSERT_COUNTRY = "insert_country",
  UPDATE_COUNTRY = "update_country",
  DELETE_COUNTRY = "delete_country",
  SEARCH_LEAGUE_CATEGORY = "search_league_category",
  GET_LEAGUE_CATEGORY_TYPES = "get_league_category_types",
  GET_ALL_LEAGUE_CATEGORY = "get_league_categories",
  GET_LEAGUE_CATEGORY_BY_ID = "get_league_category",
  INSERT_LEAGUE_CATEGORY = "insert_league_category",
  UPDATE_LEAGUE_CATEGORY = "update_league_category",
  DELETE_LEAGUE_CATEGORY = "delete_league_category",
  SEARCH_LEAGUE_TEAM = "search_team",
  GET_LEAGUE_TEAM_BY_ID = "get_team",
  INSERT_LEAGUE_TEAM = "insert_team",
  UPDATE_LEAGUE_TEAM = "update_team",
  DELETE_LEAGUE_TEAM = "delete_team",
  SEARCH_LEAGUE = "search_league",
  GET_LEAGUE_BY_ID = "get_league",
  GET_LEAGUE_TEAMS = "get_league_teams",
  INSERT_LEAGUE = "insert_league",
  UPDATE_LEAGUE = "update_league",
  DELETE_LEAGUE = "delete_league",
  ADD_TEAM_TO_LEAGUE = "add_league_team",
  ADD_TEAMS_TO_LEAGUE = "add_league_teams",
  REMOVE_TEAM_FROM_LEAGUE = "remove_league_team",
  PUBLISH_LEAGUE = "publish_league",
  SEARCH_MATCH = "search_match",
  GET_MATCH_BY_ID = "get_match",
  INSERT_MATCH = "insert_match",
  UPDATE_MATCH = "update_match",
  DELETE_MATCH = "delete_match",
  UPDATE_FEATURE_MATCH = "update_feature_match",
  SEARCH_CATEGORY_PRODUCT = "search_category_product",
  GET_CATEGORY_PRODUCT_BY_ID = "get_category_product",
  GET_CATEGORY_PRODUCT_PARENT = "get_category_product_parent",
  GET_ALL_CATEGORIES_PRODUCT = "get_categories_product",
  INSERT_CATEGORY_PRODUCT = "insert_category_product",
  UPDATE_CATEGORY_PRODUCT = "update_category_product",
  DELETE_CATEGORY_PRODUCT = "delete_category_product",
  SEARCH_PRODUCT = "search_product",
  GET_PRODUCT_BY_ID = "get_product",
  GET_ALL_PRODUCT = "get_products",
  INSERT_PRODUCT = "insert_product",
  UPDATE_PRODUCT = "update_product",
  DELETE_PRODUCT = "delete_product",
  PUBLISH_PRODUCT = "publish_product",
  GET_ALL_ORDER_STATUS = "get_order_statuses",
  SEARCH_CONTACT = "search_contact",
  UPDATE_CONTACT = "update_contact",
  DELETE_CONTACT = "delete_contact",
  SEARCH_POST = "search_article",
  GET_POST_BY_ID = "get_article",
  INSERT_POST = "insert_article",
  UPDATE_POST = "update_article",
  DELETE_POST = "delete_article",
  PUBLISH_POST = "publish_article",
  SEARCH_BANK = "search_bank",
  UPDATE_BANK = "update_bank",
  SYNC_BANK = "sync_bank",
  GET_ORDER_STATUS = "get_order_statuses",
  SEARCH_ORDER = "search_order",
  UPDATE_ORDER_STATUS = "update_order_status",
  SEARCH_DISCOUNT = "search_discount",
  INSERT_DISCOUNT = "insert_discount",
  UPDATE_DISCOUNT = "update_discount",
  DELETE_DISCOUNT = "delete_discount",
  UPDATE_PREDICT_MATCH = "update_predict",
  SEARCH_ADMIN_USER = "searchUsers",
  INSERT_ADMIN_USER = "insert_user",
  UPDATE_ADMIN_USER = "update_user",
  DELETE_ADMIN_USER = "delete_user",
  SEARCH_DEPARTMENT = "search_depart",
  INSERT_DEPARTMENT = "insert_depart",
  UPDATE_DEPARTMENT = "update_depart",
  DELETE_DEPARTMENT = "delete_depart",
  GET_REPORT_CUSTOMER = "view_report_customer",
  GET_REPORT_ORDER = "view_report_order",
  SEARCH_TRANSACTION = "search_transaction",
  DELETE_FILE = "delete_file",
  DELETE_FILES = "delete_files",
}
