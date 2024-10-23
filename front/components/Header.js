"use client"

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const allowedRoles = ['CTO', 'COO', 'CEO', 'Sales Manager', 'Finance Manager', 'Marketing Manager', 'VP of Marketing'];

const Header = ({ onSidebarOpen }) => {
    const { t, i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('https://survivor-api.poulpitos.fr/api/employees/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserAvatar(data.image);
                } else {
                    console.error(t('userProfileError'));
                }
            } catch (err) {
                console.error(t('unexpectedError'));
            }
        };

        const checkUserRole = () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);

                if (allowedRoles.includes(decodedToken.work)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (err) {
                console.error(t('roleCheckError'));
                router.push('/');
            }
        };

        fetchUserProfile();
        checkUserRole();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        router.push('/');
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
        setCurrentLanguage(lang);
        setLanguageDropdownOpen(false);
    };

    const getFlagIcon = (lang) => {
        switch (lang) {
            case 'en':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        {/* SVG content for the English flag */}
                        <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
                        <path d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z" fill="#a62842"></path>
                        <path d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z" fill="#a62842"></path>
                        <path fill="#a62842" d="M2 11.385H31V13.231H2z"></path>
                        <path fill="#a62842" d="M2 15.077H31V16.923000000000002H2z"></path>
                        <path fill="#a62842" d="M1 18.769H31V20.615H1z"></path>
                        <path d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z" fill="#a62842"></path>
                        <path d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z" fill="#a62842"></path>
                        <path d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z" fill="#102d5e"></path>
                        <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                        <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                        {/* Additional SVG paths for the English flag */}
                    </svg>
                );
            case 'fr':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <path fill="#fff" d="M10 4H22V28H10z"></path>
                        <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#092050"></path>
                        <path d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 26 16)" fill="#be2a2c"></path>
                        <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                        <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                    </svg>
                );
            case 'es':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <path fill="#f1c142" d="M1 10H31V22H1z"></path>
                    <path d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" fill="#a0251e"></path>
                    <path d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24.5)" fill="#a0251e"></path>
                    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                    <path d="M12.614,13.091c.066-.031,.055-.14-.016-.157,.057-.047,.02-.15-.055-.148,.04-.057-.012-.144-.082-.13,.021-.062-.042-.127-.104-.105,.01-.068-.071-.119-.127-.081,.004-.068-.081-.112-.134-.069-.01-.071-.11-.095-.15-.035-.014-.068-.111-.087-.149-.028-.027-.055-.114-.057-.144-.004-.03-.047-.107-.045-.136,.002-.018-.028-.057-.044-.09-.034,.009-.065-.066-.115-.122-.082,.002-.07-.087-.111-.138-.064-.013-.064-.103-.087-.144-.036-.02-.063-.114-.075-.148-.017-.036-.056-.129-.042-.147,.022-.041-.055-.135-.031-.146,.036-.011-.008-.023-.014-.037-.016,.006-.008,.01-.016,.015-.025h.002c.058-.107,.004-.256-.106-.298v-.098h.099v-.154h-.099v-.101h-.151v.101h-.099v.154h.099v.096c-.113,.04-.169,.191-.11,.299h.002c.004,.008,.009,.017,.014,.024-.015,.002-.029,.008-.04,.017-.011-.067-.106-.091-.146-.036-.018-.064-.111-.078-.147-.022-.034-.057-.128-.046-.148,.017-.041-.052-.131-.028-.144,.036-.051-.047-.139-.006-.138,.064-.056-.033-.131,.017-.122,.082-.034-.01-.072,.006-.091,.034-.029-.047-.106-.049-.136-.002-.03-.054-.117-.051-.143,.004-.037-.059-.135-.04-.149,.028-.039-.06-.14-.037-.15,.035-.053-.043-.138,0-.134,.069-.056-.038-.137,.013-.127,.081-.062-.021-.125,.044-.104,.105-.05-.009-.096,.033-.096,.084h0c0,.017,.005,.033,.014,.047-.075-.002-.111,.101-.055,.148-.071,.017-.082,.125-.016,.157-.061,.035-.047,.138,.022,.154-.013,.015-.021,.034-.021,.055h0c0,.042,.03,.077,.069,.084-.023,.048,.009,.11,.06,.118-.013,.03-.012,.073-.012,.106,.09-.019,.2,.006,.239,.11-.015,.068,.065,.156,.138,.146,.06,.085,.133,.165,.251,.197-.021,.093,.064,.093,.123,.118-.013,.016-.043,.063-.055,.081,.024,.013,.087,.041,.113,.051,.005,.019,.004,.028,.004,.031,.091,.501,2.534,.502,2.616-.001v-.002s.004,.003,.004,.004c0-.003-.001-.011,.004-.031l.118-.042-.062-.09c.056-.028,.145-.025,.123-.119,.119-.032,.193-.112,.253-.198,.073,.01,.153-.078,.138-.146,.039-.104,.15-.129,.239-.11,0-.035,.002-.078-.013-.109,.044-.014,.07-.071,.049-.115,.062-.009,.091-.093,.048-.139,.069-.016,.083-.12,.022-.154Zm-.296-.114c0,.049-.012,.098-.034,.141-.198-.137-.477-.238-.694-.214-.002-.009-.006-.017-.011-.024,0,0,0-.001,0-.002,.064-.021,.074-.12,.015-.153,0,0,0,0,0,0,.048-.032,.045-.113-.005-.141,.328-.039,.728,.09,.728,.393Zm-.956-.275c0,.063-.02,.124-.054,.175-.274-.059-.412-.169-.717-.185-.007-.082-.005-.171-.011-.254,.246-.19,.81-.062,.783,.264Zm-1.191-.164c-.002,.05-.003,.102-.007,.151-.302,.013-.449,.122-.719,.185-.26-.406,.415-.676,.73-.436-.002,.033-.005,.067-.004,.101Zm-1.046,.117c0,.028,.014,.053,.034,.069,0,0,0,0,0,0-.058,.033-.049,.132,.015,.152,0,0,0,.001,0,.002-.005,.007-.008,.015-.011,.024-.219-.024-.495,.067-.698,.206-.155-.377,.323-.576,.698-.525-.023,.015-.039,.041-.039,.072Zm3.065-.115s0,0,0,0c0,0,0,0,0,0,0,0,0,0,0,0Zm-3.113,1.798v.002s-.002,0-.003,.002c0-.001,.002-.003,.003-.003Z" fill="#9b8028"></path>
                    <path d="M14.133,16.856c.275-.65,.201-.508-.319-.787v-.873c.149-.099-.094-.121,.05-.235h.072v-.339h-.99v.339h.075c.136,.102-.091,.146,.05,.235v.76c-.524-.007-.771,.066-.679,.576h.039s0,0,0,0l.016,.036c.14-.063,.372-.107,.624-.119v.224c-.384,.029-.42,.608,0,.8v1.291c-.053,.017-.069,.089-.024,.123,.007,.065-.058,.092-.113,.083,0,.026,0,.237,0,.269-.044,.024-.113,.03-.17,.028v.108s0,0,0,0v.107s0,0,0,0v.107s0,0,0,0v.108s0,0,0,0v.186c.459-.068,.895-.068,1.353,0v-.616c-.057,.002-.124-.004-.17-.028,0-.033,0-.241,0-.268-.054,.008-.118-.017-.113-.081,.048-.033,.034-.108-.021-.126v-.932c.038,.017,.073,.035,.105,.053-.105,.119-.092,.326,.031,.429l.057-.053c.222-.329,.396-.743-.193-.896v-.35c.177-.019,.289-.074,.319-.158Z" fill="#9b8028"></path>
                    <path d="M8.36,16.058c-.153-.062-.39-.098-.653-.102v-.76c.094-.041,.034-.115-.013-.159,.02-.038,.092-.057,.056-.115h.043v-.261h-.912v.261h.039c-.037,.059,.039,.078,.057,.115-.047,.042-.108,.118-.014,.159v.873c-.644,.133-.611,.748,0,.945v.35c-.59,.154-.415,.567-.193,.896l.057,.053c.123-.103,.136-.31,.031-.429,.032-.018,.067-.036,.105-.053v.932c-.055,.018-.069,.093-.021,.126,.005,.064-.059,.089-.113,.081,0,.026,0,.236,0,.268-.045,.024-.113,.031-.17,.028v.401h0v.215c.459-.068,.895-.068,1.352,0v-.186s0,0,0,0v-.108s0,0,0,0v-.107s0,0,0,0v-.107s0,0,0,0v-.108c-.056,.002-.124-.004-.169-.028,0-.033,0-.241,0-.269-.055,.008-.119-.018-.113-.083,.045-.034,.03-.107-.024-.124v-1.29c.421-.192,.383-.772,0-.8v-.224c.575,.035,.796,.314,.653-.392Z" fill="#9b8028"></path><path d="M12.531,14.533h-4.28l.003,2.572v1.485c0,.432,.226,.822,.591,1.019,.473,.252,1.024,.391,1.552,.391s1.064-.135,1.544-.391c.364-.197,.591-.587,.591-1.019v-4.057Z" fill="#a0251e"></path></svg>
                );
            case 'zh':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#db362f"></rect>
                        <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                        <path fill="#ff0" d="M7.958 10.152L7.19 7.786 6.421 10.152 3.934 10.152 5.946 11.614 5.177 13.979 7.19 12.517 9.202 13.979 8.433 11.614 10.446 10.152 7.958 10.152z"></path>
                        <path fill="#ff0" d="M12.725 8.187L13.152 8.898 13.224 8.072 14.032 7.886 13.269 7.562 13.342 6.736 12.798 7.361 12.035 7.037 12.461 7.748 11.917 8.373 12.725 8.187z"></path>
                        <path fill="#ff0" d="M14.865 10.372L14.982 11.193 15.37 10.46 16.187 10.602 15.61 10.007 15.997 9.274 15.253 9.639 14.675 9.044 14.793 9.865 14.048 10.23 14.865 10.372z"></path>
                        <path fill="#ff0" d="M15.597 13.612L16.25 13.101 15.421 13.13 15.137 12.352 14.909 13.149 14.081 13.179 14.769 13.642 14.541 14.439 15.194 13.928 15.881 14.391 15.597 13.612z"></path>
                        <path fill="#ff0" d="M13.26 15.535L13.298 14.707 12.78 15.354 12.005 15.062 12.46 15.754 11.942 16.402 12.742 16.182 13.198 16.875 13.236 16.047 14.036 15.827 13.26 15.535z"></path>
                        <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                    </svg>
                );
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
            <div className="hidden lg:flex justify-center">
                <div className="flex items-center">
                    <svg
                        className="w-12 h-12"
                        viewBox="0 0 512 512"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                            fill="#4C51BF"
                            stroke="#4C51BF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
                            fill="white"
                        />
                    </svg>

                    <span className="text-lg font-semibold text-indigo-800">Soul Connection</span>
                </div>
            </div>

            {/* Hamburger for mobile */}
            <div className="lg:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* NAVBAR DROPDOWN */}
            <div
                className={`z-50 absolute top-16 left-0 w-full bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 hidden"
                } lg:hidden`}
            >
                <nav className="flex flex-col">
                    <Link href="/dashboard">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out  ${
                            pathname === "/dashboard"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("dashboard")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/astrology">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/astrology"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/astrology" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("Astrology")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/wardrobe">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/wardrobe"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/wardrobe" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("closet")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/employees">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/employees"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/employees" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("Employés")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/customers">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/customers"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/customers" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("Clients")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/tips">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/tips"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/tips" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("Conseils")}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/events">
                        <div
                        className={`px-6 py-2 flex items-center space-x-2 transition-colors duration-300 ease-in-out ${
                            pathname === "/dashboard/events"
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-500 hover:bg-indigo-100"
                        }`}
                        >
                        <span
                            className={`${
                            pathname === "/dashboard/events" ? "block" : "hidden"
                            } h-2 w-2 bg-white rounded-full`}></span>
                        <span>{t("events")}</span>
                        </div>
                    </Link>
                </nav>
            </div>

            {/* DESKTOP NAVBAR */}
            <div className="hidden lg:flex items-center">
                <nav className="flex flex-col md:flex-row lg:space-x-1 xl:space-x-8">
                    <Link href="/dashboard">
                        <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                            <span className="mx-2 text-sm">{t('dashboard')}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/astrology">
                        <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/astrology' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                            <span className="mx-2 text-sm">{t('Astrology')}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/wardrobe">
                        <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/wardrobe' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                            <span className="mx-2 text-sm">{t('closet')}</span>
                        </div>
                    </Link>

                    {isAuthorized && (
                        <Link href="/dashboard/employees">
                            <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/employees' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                                <span className="mx-2 text-sm">{t('Employés')}</span>
                            </div>
                        </Link>
                    )}
                    {isAuthorized && (
                        <Link href="/dashboard/customers">
                            <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/customers' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                                <span className="mx-2 text-sm">{t('Clients')}</span>
                            </div>
                        </Link>
                    )}

                    <Link href="/dashboard/tips">
                        <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/tips' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                            <span className="mx-2 text-sm">{t('Conseils')}</span>
                        </div>
                    </Link>

                    <Link href="/dashboard/events">
                        <div className={`flex items-center py-2 transition-all duration-300 ease-in-out ${pathname === '/dashboard/events' ? 'border-b-4 border-indigo-600 text-indigo-800' : 'text-indigo-500 hover:border-b-4 hover:border-indigo-600'}`}>
                            <span className="mx-2 text-sm">{t('events')}</span>
                        </div>
                    </Link>
                </nav>
            </div>

            <div className="flex items-center">
                <div className="relative mr-6">
                    <button onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className="flex items-center focus:outline-none">
                        {getFlagIcon(currentLanguage)}
                    </button>
                    {languageDropdownOpen && (
                        <div className="absolute z-10 w-15 mt-2 right-[-16px] bg-white rounded-md shadow-xl">
                            <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
                                {getFlagIcon('en')}
                            </button>
                            <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
                                {getFlagIcon('fr')}
                            </button>
                            <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
                                {getFlagIcon('es')}
                            </button>
                            <button onClick={() => changeLanguage('zh')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
                                {getFlagIcon('zh')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none">
                        <Image width={32} height={32} className="object-cover w-full h-full" src={userAvatar || "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"} alt={t('avatarAlt')} />
                    </button>

                    {dropdownOpen && (
                        <div className="fixed inset-0 z-10 w-full h-full" onClick={() => setDropdownOpen(false)}></div>
                    )}

                    {dropdownOpen && (
                        <div className="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
                            <div className='flex items-center hover:bg-red-600 hover:text-white p-2 text-red-600 w-full' id='logout-div'>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white fill-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M10 5a2 2 0 0 0-2 2v3h2.4A7.48 7.48 0 0 0 8 15.5a7.48 7.48 0 0 0 2.4 5.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V7a4 4 0 1 1 8 0v1.15a7.446 7.446 0 0 0-1.943.685A.999.999 0 0 1 12 8.5V7a2 2 0 0 0-2-2Z" clip-rule="evenodd"/>
                                    <path fill-rule="evenodd" d="M10 15.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Zm6.5-1.5a1 1 0 1 0-2 0v1.5a1 1 0 0 0 .293.707l1 1a1 1 0 0 0 1.414-1.414l-.707-.707V14Z" clip-rule="evenodd"/>
                                </svg>
                                <button onClick={handleLogout} className="block w-full text-left px-2 text-sm">{t('logout')}</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
