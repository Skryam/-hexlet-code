import Listr from 'listr';

const ap = new Listr([
  {
    title: '1',
    task: (ctx, task) => {
      try {
        1();
      } catch (e) {
        task.skip('skip');
      }
    },
  },
  {
    title: '2',
    task: () => {
      return 1 + 20;
    },
  },
]);

ap.run().catch((err) => {
  console.error(err);
});
