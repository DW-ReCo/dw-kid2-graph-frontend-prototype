import React from "react";

import { extractYoutubeId } from "@frontend/utils";

const YoutubeEmbed = (props: { url: string }) => {
  const { url } = props;

  const id = extractYoutubeId(url);

  return (
    <div>
      <iframe src={`https://www.youtube.com/embed/${id}`}></iframe>
      {url}
    </div>
  );
};

export default YoutubeEmbed;
