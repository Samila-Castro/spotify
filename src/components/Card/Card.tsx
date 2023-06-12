import { IconButton } from "rsuite";
import style from "./Card.module.css";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";

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
    <div className={style.main}>
      <div className={style.loader}>
        <div className={style.buttonWrapper}>
          {" "}
          <IconButton
            icon={isDelete ? <TrashIcon /> : <PlusIcon />}
            appearance="primary"
            color={isDelete ? `red` : `green`}
            circle
            onClick={onClick}
          />
        </div>
        <div className={style.song}>
          <p className={style.name}>{music}</p>
          <p className={style.artist}>
            {artist} | {album}
          </p>
        </div>
        <img src={image} alt="visual album" className={style.albumcover} />

        <div className={style.play}></div>
      </div>
    </div>
  );
};
