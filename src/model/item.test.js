const Item = require('./item');

test('should be initialized', () => {
  const item = new Item();
  expect(item.id).toBeUndefined();
  expect(item.state).toBeUndefined();
  expect(item.isEnabled()).toBeFalsy();
  expect(item.isDeleted()).toBeFalsy();
});

test('should be enabled', () => {
  const item = new Item(1, 1);
  expect(item.id).toEqual(1);
  expect(item.state).toEqual(1);
  expect(item.isEnabled()).toBeTruthy();
  expect(item.isDeleted()).toBeFalsy();
});

test('should be disabled', () => {
  const item = new Item(2, 3);
  expect(item.id).toEqual(2);
  expect(item.state).toEqual(3);
  expect(item.isEnabled()).toBeFalsy();
  expect(item.isDeleted()).toBeTruthy();
});
