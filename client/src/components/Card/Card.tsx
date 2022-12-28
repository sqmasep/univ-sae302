import { TurnedIn, TurnedInNot } from "@mui/icons-material";
import { Box, Checkbox, Tooltip, Zoom } from "@mui/material";
import { motion, MotionValue, useMotionValue } from "framer-motion";
import React, { useState } from "react";
import { useSavedDocuments } from "../../contexts/SavedDocumentsProvider";
import { Document } from "../../pages/Playground/Playground";

const MotionBox = motion(Box);
const MotionCheckbox = motion(Checkbox);

const Card: React.FC<
  {
    card: Document;
    controls?: boolean;
    imgSource?: string;
    saving?: boolean;
    x?: MotionValue<number>;
    y?: MotionValue<number>;
    setSaving?: (saving: boolean) => void;
  } & Omit<React.ComponentProps<typeof MotionBox>, "ref">
> = ({
  card,
  layoutId,
  drag,
  controls = false,
  imgSource = card.sourceLowRes,
  style,
  saving,
  x,
  y,
  setSaving = () => {},
  ...props
}) => {
  const { pushUnique, remove, inArray } = useSavedDocuments();
  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    checked ? pushUnique(card) : remove(card);
  };

  return (
    // draggable box
    <MotionBox
      whileHover={drag ? { scale: 1.05, rotateZ: 3 } : undefined}
      whileTap={drag ? { scale: saving ? 1.05 : 0.95 } : undefined}
      drag={!("ontouchstart" in window) && drag}
      dragMomentum={false}
      style={[x, y].includes(undefined) ? undefined : { x, y }}
      {...props}
      sx={{
        position: "relative",
        maxHeight: "100%",
      }}
    >
      {/* layoutId wrapper div */}
      <motion.div style={style} layoutId={layoutId}>
        {/* overlay box */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            // backgroundImage: "linear-gradient(to bottom, transparent, #0005)",
          }}
        />
        <motion.img
          draggable='false'
          style={{ maxWidth: "100%", maxHeight: "100vh", objectFit: "contain" }}
          src={`/imgs/playground/${imgSource}`}
        />
        {/* blur box */}
        <Box
          sx={{
            position: "absolute",
            width: "75%",
            left: "50%",
            bottom: ".5rem",
            transform: "translateX(-50%)",
            height: "2rem",
            borderRadius: "50%",
            backgroundImage: `url(/imgs/playground/${imgSource})`,
            filter: "blur(2rem)",
            backgroundSize: "cover",
            opacity: 0.5,
          }}
        />
        {/* save checkbox */}
        {controls && (
          // <Tooltip
          //   placement='left'
          //   TransitionComponent={Zoom}
          //   title={inArray(card) ? "Retirer" : "Sauvegarder"}
          // >
          <MotionCheckbox
            icon={<TurnedInNot />}
            checked={inArray(card)}
            onChange={handleChange}
            onTapStart={() => setSaving(true)}
            onTap={() => setSaving(false)}
            value={card.sourceLowRes}
            checkedIcon={<TurnedIn />}
            sx={{ position: "absolute", bottom: 0, left: 0 }}
          />
          // </Tooltip>
        )}
      </motion.div>
    </MotionBox>
  );
};

export default Card;
