import React, { PureComponent } from "react";
import ErrorPage from  "./ErrorPage";

export default class ErrorBound extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 1、错误信息（error）
    // 2、错误堆栈（errorInfo)
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo}/>;
    }
    return this.props.children;
  }
}