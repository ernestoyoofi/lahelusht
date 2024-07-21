"use client"

import { SnackbarProvider } from 'notistack'
export default function App(props) {
  return <>
    <SnackbarProvider anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }} maxSnack={12}>
      {props.children}
    </SnackbarProvider>
  </>
}