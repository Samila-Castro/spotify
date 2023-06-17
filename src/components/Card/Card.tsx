import { IconButton } from "rsuite";
import style from "./Card.module.css";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";
import PlayOutlineIcon from "@rsuite/icons/PlayOutline";

interface CardPrrops {
  music: string;
  artist?: string;
  album: string;
  image?: string;
  isDelete?: boolean;
  onClick?: () => void;
}
export const Card = ({
  music,
  artist,
  album,
  image,
  isDelete,
  onClick,
}: CardPrrops) => {
  return (
    <div className={style.loader}>
      <div>
        <PlayOutlineIcon />
      </div>
      <div className={style.song}>
        <img src={image} alt="visual album" className={style.albumcover} />
        <div className={style.contentSongWrapper}>
          <p className={style.name}>
            {music.length > 15 ? music.slice(0, 15) + "..." : music}
          </p>
          <p className={style.artist}>
            {artist} | {album}
          </p>
        </div>
      </div>
      <div>
        {" "}
        <IconButton
          icon={isDelete ? <TrashIcon /> : <PlusIcon />}
          appearance="primary"
          color={isDelete ? `red` : `green`}
          circle
          onClick={onClick}
        />
      </div>
    </div>
  );
};
