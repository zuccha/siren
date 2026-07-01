import { Input as ChakraInput, type InputProps as ChakraInputProps } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// Input
//------------------------------------------------------------------------------

export type InputProps = ChakraInputProps;

export default function Input(props: InputProps) {
  return <ChakraInput colorPalette="accent" {...props} />;
}
