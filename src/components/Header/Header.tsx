import styles from "./Header.module.css";
import spotifyLogo from "../../assets/spotify-logo.svg";
import { Button } from "rsuite";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import React from "react";

const labels = {
  logOut: "out",
};

interface HeaderProps {
  toggletheme: (value: boolean) => void;
  login: () => void;
  user?: string;
}

export const Header = ({ toggletheme, login, user }: HeaderProps) => {
  const [isDarkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = (checked: boolean) => {
    toggletheme(checked);
    setDarkMode(checked);
  };
  return (
    <header className={styles.header}>
      <div className={styles.wrapperLogo}>
        <img src={spotifyLogo} />
        <h3>Spotify Playlist Maker </h3>
      </div>
      <div className={styles.buttonsWrapper}>
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={20}
          color="#fff"
        />
        <pre className={styles.userValue}>{user}</pre>

        <Button
          color="green"
          appearance="ghost"
          startIcon={user ? <BiLogOut /> : <BiLogIn />}
          onClick={login}
        >
          {user ? labels.logOut : "Login"}
        </Button>
      </div>
    </header>
  );
};
