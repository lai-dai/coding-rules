/* eslint-disable custom-rules/encourage-object-params */
import parsePhoneNumber from "libphonenumber-js"
import {
  z,
} from "zod"

export type MultiLang = {
  vi: string
  en: string
}

export type Author = {
  _id: number
  full_name: string
  avatar_link: string | false
  email: string
  phone: string
  group_name: MultiLang
}

export const phoneSchema = z
  .string()
  .min(
    1, "Vui lòng nhập số điện thoại"
  )
  .transform((
    arg, ctx
  ) => {
    const phone = parsePhoneNumber(
      arg, {
      // set this to use a default country when the phone number omits country code
        defaultCountry: "VN",

        // set to false to require that the whole string is exactly a phone number,
        // otherwise, it will search for a phone number anywhere within the string
        extract: false,
      }
    )

    // when it's good
    if (phone?.isValid()) {
      return phone.number.replace(
        "+84", "0"
      )
    }

    // when it's not
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Số điện thoại không hợp lệ",
    })
    return z.NEVER
  })
