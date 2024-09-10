'use client';
import { Calendar } from '@/components/ui/calendar';
import { Card } from './ui/card';
import { zhCN } from 'date-fns/locale';
import useCountStore from '@/store/count';
import {
  CustomComponents,
  Day,
  WeekNumber,
  useDayPicker,
} from 'react-day-picker';
import { format, getUnixTime } from 'date-fns';
import useFilterStore from '@/store/filter';

const ActivityCalendar: React.FC = () => {
  const { memosByDaysMap } = useCountStore();
  const { timeFilter, setTimeFilter } = useFilterStore();
  const remarkedColor = (count: number): string => {
    if (count === 0) {
      return '';
    }
    const colorMap: Record<number, string> = {
      1: 'bg-green-600 ',
      2: 'bg-green-700 ',
      3: 'bg-green-800 ',
      4: 'bg-green-900 ',
      5: 'bg-green-950 ',
    };
    return `${colorMap[count] ?? 'bg-green-950'} text-white `;
  };

  const Row: CustomComponents['Row'] = (props) => {
    const { styles, classNames, showWeekNumber, components } = useDayPicker();
    const DayComponent = components?.Day ?? Day;
    const WeeknumberComponent = components?.WeekNumber ?? WeekNumber;
    let weekNumberCell;
    if (showWeekNumber) {
      weekNumberCell = (
        <td className={classNames.cell} style={styles.cell}>
          <WeeknumberComponent number={props.weekNumber} dates={props.dates} />
        </td>
      );
    }

    return (
      <tr className={classNames.row} style={styles.row}>
        {weekNumberCell}
        {props.dates.map((date) => {
          const dateTime = format(date, 'yyyy/MM/dd');
          const memosByDay = memosByDaysMap?.get(dateTime);
          const length = memosByDay?.length ?? 0;
          return (
            <td
              className={`${classNames.cell} ${remarkedColor(length)}   `}
              style={styles.cell}
              key={getUnixTime(date)}
              role="presentation"
              title={`${length}笔记于${dateTime}`}
            >
              <DayComponent displayMonth={props.displayMonth} date={date} />
            </td>
          );
        })}
      </tr>
    );
  };
  return (
    <Card className=" w-full ">
      <Calendar
        disabled={(date)=>{
          return date > new Date();
        }}
        locale={zhCN}
        captionLayout="dropdown"
        className="px-1 py-2 "
        mode="single"
        selected={timeFilter}
        onSelect={setTimeFilter}
        classNames={{
          day_today: '',
        }}
        components={{
          Row,
        }}
      />
    </Card>
  );
};

export default ActivityCalendar;
