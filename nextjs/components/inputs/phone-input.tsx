/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

import {
  PatternFormat, type PatternFormatProps,
} from "react-number-format"

import {
  Input,
} from "~/shared/components/ui/input"

export type PhoneInputProps = Omit<PatternFormatProps, "format">

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>((
  props, forwardRef
) => {
  return (
    <PatternFormat
      getInputRef={forwardRef}
      customInput={Input}
      inputMode="numeric"
      {...props}
      format="### #### ###"
    />
  )
})
PhoneInput.displayName = "PhoneInput"
