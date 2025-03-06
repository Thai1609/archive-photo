import LayoutPage from "./photos/layout";
import HomePage from "./photos/page";

export default function Home() {
  return <LayoutPage children={<HomePage></HomePage>}></LayoutPage>;
}
