import { fakerDE as faker } from '@faker-js/faker';

const generateMemoViewProps = () => ({
  content: faker.lorem.paragraph(),
  tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.lorem.word(),
  ),
  time: faker.date.past().toUTCString(),
});

const generateMemoData = (count: number) => {
  return Array.from({ length: count }, generateMemoViewProps);
};

export { generateMemoData };
