import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FormControl } from '../ui/form';

interface GenericSelectProps {
  placeholder: string;
  items: string[];
}

export default function GenericSelect({
  placeholder,
  items,
}: GenericSelectProps) {
  return (
    <Select>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a plant" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {items.map((item, index) => (
          <SelectItem key={index} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
