import { Menubar } from "primereact/menubar";
import React from "react";

function Auction({ handleLogout }) {
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => console.log("Home"),
    },
    {
      label: "Lelang",
      icon: "pi pi-dollar",
      items: [
        {
          label: "Kelola Lelang",
          icon: "pi pi-cog",
          command: () => console.log("Kelola Lelang"),
        },
        {
          label: "Tambah Lelang",
          icon: "pi pi-plus",
          command: () => console.log("Tambah Lelang"),
        },
      ],
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  return (
    <div>
      <Menubar model={items} />
      <div className="p-mt-6">
        <h1>Halaman Lelang</h1>
        <p>
          Halaman Lelang hanya boleh diakses user terotentikasi dan role user
        </p>
      </div>
    </div>
  );
}

export default Auction;
