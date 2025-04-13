import React from 'react';
import { NavLink } from 'react-router-dom';

const DesktopMenu = ({ menu }) => {
    return (
        <li>
            <NavLink
                to={`/${menu.name.toLowerCase().replace(" ", "-")}`}
                className={({ isActive }) =>
                    `flex items-center gap-1 cursor-pointer px-4 rounded-lg hover:bg-red-700/20 hover:text-red-700 transition-colors delay-100 duration-200 p-1 text-center font-bold ${
                        isActive ? 'bg-red-700/20 text-red-700' : ''
                    }`
                }
            >
                {menu.name}
            </NavLink>
        </li>
    );
};

export default DesktopMenu;