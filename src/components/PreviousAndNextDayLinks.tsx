import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import { dateFormat } from "~/routes";

export default component$(() => {
 const loc = useLocation();
 const paramsDate = `${loc.params.year}-${loc.params.month}-${loc.params.day}`;
 const currentDay = loc.url.pathname === "/" ? dayjs() : paramsDate;

 return (
  <div class="flex items-center gap-10 mt-2">
   <div class="flex">
    <Link
     class="underline hover:no-underline"
     href={`/${dayjs(currentDay).subtract(1, "day").format(dateFormat)}`}
    >
     Föregående dag ({dayjs(currentDay).subtract(1, "day").format("DD/MM-YY")})
    </Link>
   </div>
   {loc.url.pathname === "/" ||
   dayjs(paramsDate).add(1, "day").diff(dayjs()) > 0 ? (
    <span>
     Nästa dag ({dayjs(currentDay).add(1, "day").format("DD/MM-YY")})
    </span>
   ) : (
    <Link
     class="underline hover:no-underline"
     href={`/${dayjs(currentDay).add(1, "day").format(dateFormat)}`}
    >
     Nästa dag ({dayjs(currentDay).add(1, "day").format("DD/MM-YY")})
    </Link>
   )}
  </div>
 );
});
