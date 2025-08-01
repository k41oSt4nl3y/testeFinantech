import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export default function ToastContainer() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      }}
    />
  );
}