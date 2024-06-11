import React, { useState } from "react";
import { StarRating } from "./StarRating";

const Test = () => {
  const [movieRating, setMovieRating] = useState(0);
  console.log(movieRating);
  return (
    <div>
      <StarRating color="blue" onSetRating={setMovieRating} />
      <div>
        <p> this movie was rated {movieRating}</p>
      </div>
    </div>
  );
};

export default Test;
