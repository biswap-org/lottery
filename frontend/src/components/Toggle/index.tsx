import { Box, Switch, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  checked: boolean;
  setChecked: Function;
  label: string;
  icon?: any;
};

const SwitchToggle: React.FC<Props> = ({ checked, setChecked, label, icon }) => {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
      {icon}
      <Text ml={"10px"}>
        {label}
      </Text>
      <Switch
        size='md'
        ml={"auto"}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        backgroundColor={"transparent"}
      />
    </Box>
  );
};

export default SwitchToggle;
