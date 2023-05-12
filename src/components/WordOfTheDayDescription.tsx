import { component$ } from "@builder.io/qwik";
type Props = {
 description: string;
};

export default component$(({ description }: Props) => {
 return <p class="max-w-[560px]">{description}</p>;
});
