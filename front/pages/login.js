"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from "@nextui-org/react";

const storeTokenSecurely = (token) => {
  sessionStorage.setItem('token', token);
};

const getTokenSecurely = () => {
  return sessionStorage.getItem('token');
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'fr';
    i18n.changeLanguage(savedLanguage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://survivor-api.poulpitos.fr/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        storeTokenSecurely(data.access_token);
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.error);
      }
    } catch (err) {
      console.log(err);
      setError(t('unexpectedError'));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 px-6">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <div className="flex justify-center items-center">
          <svg className="h-10 w-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          </svg>
          <span className="text-gray-700 font-semibold text-2xl">Soul Connection</span>
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700 text-sm">{t('email')}</span>
            <input
              type="email"
              className="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block mt-3">
            <span className="text-gray-700 text-sm">{t('password')}</span>
            <input
              type="password"
              className="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-indigo-600" />
                <span className="mx-2 text-gray-600 text-sm">{t('rememberMe')}</span>
              </label>
            </div>
            <div>
              <a className="block text-sm fontme text-indigo-700 hover:underline" href="#">{t('forgotPassword')}</a>
            </div>
          </div>

          <div className="mt-6">
            <button className="py-2 px-4 text-center bg-indigo-600 rounded-md w-full text-white text-sm hover:bg-indigo-500">
              {t('login')}
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>

        <div className="mt-4 flex justify-center space-x-2">
          <button onClick={() => changeLanguage('en')} className="text-sm text-indigo-700 hover:underline">English</button>
          <button onClick={() => changeLanguage('fr')} className="text-sm text-indigo-700 hover:underline">Français</button>
          <button onClick={() => changeLanguage('es')} className="text-sm text-indigo-700 hover:underline">Español</button>
          <button onClick={() => changeLanguage('zh')} className="text-sm text-indigo-700 hover:underline">中文</button>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Login), { ssr: false });
