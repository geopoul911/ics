// Built-ins
import React from "react";

// Functions / Modules
import moment from "moment";

// Variables
let days = 0;
const day_in_seconds = 86400;

function Timer(props) {
  let [seconds, setSeconds] = React.useState(props.time);
  const formatted = moment.utc(seconds * 1000).format("HH : mm : ss");

  React.useEffect(() => {
    setTimeout(() => setSeconds(seconds + 1), 1000);
  });

  while (seconds > day_in_seconds) {
    seconds = seconds - day_in_seconds;
    days++;
  }

  return (
    <div>
      {days < 10 ? (
        days !== 0 ? (
          <> 0{days} : </>
        ) : (
          ""
        )
      ) : days !== 0 ? (
        <> {days} : </>
      ) : (
        ""
      )}
      {formatted}
    </div>
  );
}

export default Timer;
