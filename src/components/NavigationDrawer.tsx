import Icon from './Icon';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import Tools from './Tools';

const NavigationDrawer = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <Button
          className="w-5 h-auto dark:text-gray-400"
          variant="ghost"
          size="icon"
        >
          <Icon.Menu size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col  h-full w-60 mt-24   px-4 py-4 fixed bottom-0 left-0">
        <Tools />
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationDrawer;
