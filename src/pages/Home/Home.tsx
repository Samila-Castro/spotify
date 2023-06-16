import { Button, IconButton, Input, InputGroup, Message } from "rsuite";
import { Header } from "../../components/Header/Header";
import { Card } from "../../components/Card/Card";
import React, { useState } from "react";

import style from "./Home.module.css";
import SearchIcon from "@rsuite/icons/Search";
import EditIcon from "@rsuite/icons/Edit";
import CheckIcon from "@rsuite/icons/Check";
import {
  generateCodeChallenge,
  generateRandomString,
} from "../../utils/functions";

const styles = {
  width: 300,
};

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  uri: string;
}

const Home = () => {
  const [accessToken, setAccessToken] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [user, setUser] = React.useState<any>();

  const [newPlaylist, setNewPlaylist] = React.useState<Track[]>([]);
  const [editNewPlaylistName, setEditNewPlaylistName] =
    React.useState<boolean>(false);
  const [inputPlaylistName, setInputPlaylistName] =
    React.useState<string>("New Playlist");
  const [playlistName, setPlaylistName] =
    React.useState<string>("New Playlist");
  const [theme, setTheme] = useState<string>("theme-white");
  const [showInfo, setShowInfo] = React.useState(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    let codeVerifier = localStorage.getItem("code_verifier");
    let accessToken = localStorage.getItem("access_token");

    if (accessToken) setAccessToken(accessToken);

    if (!codeVerifier || !code) return;

    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/home",
      client_id: import.meta.env.VITE_CLIENT_ID || "",
      code_verifier: codeVerifier,
    });

    const response = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    async function getProfile() {
      let accessToken = localStorage.getItem("access_token");

      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      return await response.json();
    }

    const getUserData = async () => {
      const result = await getProfile();
      setUser(result);
    };

    getUserData();
  }, []);

  const onSearchButtonClick = async () => {
    if (term === "" || accessToken === "") return;

    const requestParams = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const result = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      requestParams
    ).then((result) => result.json());
    setTracks(result.tracks.items);
  };

  const onLoginButtonClick = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID || "";

    const redirectUri = "http://localhost:3000/home";

    let codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "user-read-private playlist-modify-private";

      localStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location.href = "https://accounts.spotify.com/authorize?" + args;
    });
  };

  const handleTheme = (value: boolean) => {
    if (value) setTheme("theme-dark");
    else {
      setTheme("theme-white");
    }
  };

  async function createNewPlaylist() {
    let accessToken = localStorage.getItem("access_token");

    const response = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        method: "POST",
        body: JSON.stringify({ name: playlistName, public: false }),
      }
    ).then((response) => {
      console.log("response ", response);
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    });
    addIttemsToPlaylist(response.id);
    setPlaylistName("Playlist name");
    setInputPlaylistName("Playlist name");
    setShowInfo(true);
  }

  const handleAddOnNewPlaylist = (value: Track) => {
    const alreadyExistVerify = newPlaylist.some(
      (track) => track.id === value.id
    );

    if (!alreadyExistVerify) setNewPlaylist([...newPlaylist, value]);
  };

  const handleDeleteItemNewPlaylist = (value: Track) => {
    setNewPlaylist([...newPlaylist, value]);

    const playlistFiltered = newPlaylist.filter((item) => item.id !== value.id);

    setNewPlaylist(playlistFiltered);
  };

  async function addIttemsToPlaylist(id: string) {
    let accessToken = localStorage.getItem("access_token");
    const uriTracks = newPlaylist.map((track) => track.uri);
    setNewPlaylist([]);
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        headers: { Authorization: "Bearer " + accessToken },
        method: "POST",
        body: JSON.stringify({
          uris: uriTracks,
          position: 0,
        }),
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    });
  }

  const handleSavePlaylistName = () => {
    setPlaylistName(inputPlaylistName);
    setEditNewPlaylistName(false);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <div className={theme}>
      <Header
        toggletheme={handleTheme}
        login={onLoginButtonClick}
        user={user?.display_name}
      />
      <div className={style.inputBox}>
        <InputGroup inside style={styles}>
          <Input
            value={term}
            onChange={(event) => setTerm(event)}
            placeholder="Search"
          />
          <InputGroup.Button>
            <SearchIcon onClick={onSearchButtonClick} />
          </InputGroup.Button>
        </InputGroup>
      </div>
      {showInfo && (
        <div className={style.infoWrapper}>
          <Message showIcon type="success" closable onClick={closeInfo}>
            Playlist criada com sucesso
          </Message>
        </div>
      )}
      <main>
        <div className={style.resultBox}>
          <h3>Result</h3>
          <div className={style.content}>
            {tracks.map((track) => (
              <Card
                music={track.name}
                artist={track.artists[0].name}
                album={track.album.name}
                image={track.album.images[1].url}
                onClick={() => handleAddOnNewPlaylist(track)}
              />
            ))}
          </div>
        </div>
        <div className={style.newPlaylistBox}>
          <div className={style.headerBox}>
            {!editNewPlaylistName && <h3>{playlistName}</h3>}
            {editNewPlaylistName && (
              <InputGroup inside style={styles}>
                <Input
                  value={inputPlaylistName}
                  onChange={(event) => setInputPlaylistName(event)}
                />
                <InputGroup.Button>
                  <CheckIcon onClick={handleSavePlaylistName} />
                </InputGroup.Button>
              </InputGroup>
            )}

            <IconButton
              size="xs"
              icon={
                <EditIcon
                  onClick={() => setEditNewPlaylistName(!editNewPlaylistName)}
                />
              }
            />
          </div>
          <div className={style.newPlaylist}>
            {newPlaylist.map((track) => (
              <Card
                music={track.name}
                artist={track.artists[0].name}
                album={track.album.name}
                image={track.album.images[1].url}
                isDelete={true}
                onClick={() => handleDeleteItemNewPlaylist(track)}
              />
            ))}
          </div>
          {!!newPlaylist.length && (
            <Button
              color="green"
              appearance="ghost"
              onClick={createNewPlaylist}
            >
              Criar playlist
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
