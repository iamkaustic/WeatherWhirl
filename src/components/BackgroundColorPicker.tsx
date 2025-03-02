import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBackgroundColor, backgroundColors, BackgroundColorOption } from './BackgroundColorProvider';
import { useTheme } from './ThemeProvider';

const BackgroundColorPicker: React.FC = () => {
  const { backgroundColor, setBackgroundColor } = useBackgroundColor();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Color options with display names
  const colorOptions: { value: BackgroundColorOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'amber', label: 'Amber' },
    { value: 'gray', label: 'Gray' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-none ${
            isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
          }`}
        >
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change background color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 md:w-auto">
        {colorOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setBackgroundColor(option.value)}
            className="flex items-center gap-2 cursor-pointer py-2 px-3"
          >
            <div
              className="w-4 h-4 rounded-full border"
              style={{
                background: isDark
                  ? backgroundColors[option.value].dark
                  : backgroundColors[option.value].light,
                borderColor: isDark ? '#444' : '#ddd',
              }}
            />
            <span className="text-sm md:text-base">{option.label}</span>
            {backgroundColor === option.value && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BackgroundColorPicker;
