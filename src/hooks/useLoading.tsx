import React from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@heroui/react";

type LoadingProps = {
  fullScreen?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

export const useLoading = (props?: LoadingProps) => {
  const { loadingText = '' } = props ?? {};
  const LoadingComponent = () => createPortal(
    <div
      id="full-screen-loading"
      className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden
      `}
    >
      <div className="h-full w-full flex items-center justify-center">
        <Spinner
          label={loadingText}
          className="w-8 h-8 text-primary"
        />
      </div>
    </div>,
    document.body
  );

  const startLoading = () => {
    const loading = document.getElementById('full-screen-loading');
    loading?.classList.remove('hidden');
  };

  const stopLoading = () => {
    const loading = document.getElementById('full-screen-loading');
    loading?.classList.add('hidden');
  };

  return {
    startLoading,
    stopLoading,
    LoadingComponent,
  };
}

export default useLoading;