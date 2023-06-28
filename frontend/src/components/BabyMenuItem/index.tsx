import ButtonWithIcon from "../ButtonWithIcon";
const BabyMenuItem = ({
  isLast = true,
  to = "/",
  icon = {},
  label = "Button",
  comingsoon = false,
  ...rest
}) => {
  return (
    <ButtonWithIcon
      pathname={to}
      // icon={icon}
      label={label}
      comingsoon={comingsoon}
    ></ButtonWithIcon>
  );
};
export default BabyMenuItem;
