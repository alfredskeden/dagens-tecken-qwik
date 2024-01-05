import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { dateFormat } from "~/routes/layout";

dayjs.extend(isToday);

export default component$(() => {
  const loc = useLocation();
  const paramsDate = `${loc.params.year}-${loc.params.month}-${loc.params.day}`;
  const currentDay = loc.url.pathname === "/" ? dayjs() : paramsDate;
  const previousDay = dayjs(currentDay).subtract(1, "day");
  const nextDay = dayjs(currentDay).add(1, "day");

  return (
    <div class="flex items-center gap-10 mt-2">
      <div class="flex">
        <Link
          class="underline hover:no-underline"
          href={`/${previousDay.format(dateFormat)}`}
        >
          Föregående dag ({previousDay.format("DD/MM-YY")})
        </Link>
      </div>
      {loc.url.pathname === "/" || nextDay.diff(dayjs()) > 0 ? (
        <span>Nästa dag ({nextDay.format("DD/MM-YY")})</span>
      ) : (
        <Link
          class="underline hover:no-underline"
          href={nextDay.isToday() ? "/" : `/${nextDay.format(dateFormat)}`}
        >
          Nästa dag ({nextDay.format("DD/MM-YY")})
        </Link>
      )}
    </div>
  );
});
