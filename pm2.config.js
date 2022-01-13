module.exports = {
  apps: [
    {
      name: 'kartevonmorgen-dev',
      script: 'yarn start:dev',
    },
    {
      name: 'kartevonmorgen-tag-synchronizer-dev',
      script: 'python3 scripts/python/tag-frequency-cron.py --dev --kvm-path . --fetch-all-on-start --sync-once --log-level debug',
    },
  ],
}
