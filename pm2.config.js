module.exports = {
  apps: [
    {
      name: 'kartevonmorgen-dev',
      script: 'yarn start:dev',
    },
    {
      name: 'kartevonmorgen-tag-synchronizer-dev',
      cwd: 'scripts/python/',
      script: 'python3 ./scripts/python/tag-frequency-cron.py --dev --fetch-all-on-start --sync-once --log-level debug',
    },
  ],
}
