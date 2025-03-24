import { Socket } from "socket.io-client";
import { crypto } from "../crypto";
import localStore from "store2";
import { LocalStore2Key } from "@/types";
import { Cmd, emitEvent } from "@/providers/socket-io.admin";
import { useAdminUser } from "@/hooks/auth/use-admin.user";
import { toast } from "sonner";

export const auth = {
  login: async (data: { username: string; password: string }) => {
    const cryptoSHA3Password = await crypto.cryptoSHA3(data.password);
    const res = await emitEvent({
      cmd: Cmd.LOGIN,
      body: {
        user_name: data.username,
        password: cryptoSHA3Password,
      },
    });
    return res;
  },
  refreshToken: async (data: { oldToken: string; refreshToken: string }) => {
    return await emitEvent({
      cmd: Cmd.REFRESH_TOKEN,
      body: {
        old_token: data.oldToken,
        refresh_token: data.refreshToken,
      },
    });
  },
  getMe: async () => {
    return await emitEvent({
      cmd: Cmd.GET_ME,
    });
  },
  setOnline: async (token: string) => {
    return await emitEvent(token, {
      eventName: Cmd.SET_ONLINE,
    });
  },
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return await emitEvent({
      cmd: Cmd.CHANGE_PASSWORD,
      body: {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      },
    });
  },
  sendEmailResetPassword: async (data: { email: string }) => {
    return await emitEvent({
      cmd: Cmd.SEND_EMAIL_RESET_PASSWORD,
      body: {
        email: data.email,
      },
    });
  },
  checkResetPasswordCode: async (code: string) => {
    return await emitEvent({
      cmd: Cmd.CHECK_RESET_PASSWORD_CODE,
      body: {
        code,
      },
    });
  },
  resetPassword: async (data: { code: string; password: string }) => {
    const cryptoSHA3Password = await crypto.cryptoSHA3(data.password);
    return await emitEvent({
      cmd: Cmd.RESET_PASSWORD,
      body: {
        code: data.code,
        password: cryptoSHA3Password,
      },
    });
  },
  handleRefreshToken: async (socket: Socket) => {
    const localTokenKey = LocalStore2Key.ADMIN_TOKEN;
    const localRefreshTokenKey = LocalStore2Key.ADMIN_REFRESH_TOKEN;
    const oldToken = localStore.get(localTokenKey);
    const refreshToken = localStore.get(localRefreshTokenKey);
    const res = await auth.refreshToken({
      oldToken,
      refreshToken,
    });

    if (!res.status) {
      toast.error("Phiên đăng nhập đã hết hạn.", {
        description: " Vui lòng đăng nhập lại!",
      });
      useAdminUser.getState().logout();
      return res;
    }
    const newToken = res.data.token;
    const newRefreshToken = res.data.refresh_token;
    localStore.add(localTokenKey, newToken);
    localStore.add(localRefreshTokenKey, newRefreshToken);
    await auth.setOnline(newToken);
    return res;
  },
  updateProfile: async (data: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    cccd: string;
    cccd_date: Date;
    birthday: Date;
  }) => {
    return await emitEvent({
      cmd: Cmd.UPDATE_PROFILE,
      body: data,
    });
  },
};
