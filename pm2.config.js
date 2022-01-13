module.exports = {
  apps: [
    {
      name: 'kartevonmorgen-dev',
      script: 'yarn start:dev',
    },
    {
      name: 'kartevonmorgen-tag-synchronizer-dev',
      interpreter: 'python3',
      script: 'scripts/python/tag-frequency-cron.py',
      args: '--dev --kvm-path . --fetch-all-on-start --sync-once --log-level debug',
    },
  ],
}
