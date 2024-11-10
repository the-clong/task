import React from "react";
const ErrorPage = (props) => {
  const { error, errorInfo } = props;
  return <div>{error.message}</div>
}
export default ErrorPage;