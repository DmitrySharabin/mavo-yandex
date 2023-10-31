# Yandex Disk Backend

**Warning:** The plugin is currently in alpha and still is a work in progress. It may have (even for sure does 😝) bugs. Play around with it, and let us know if you encounter any bugs!

## Getting started

- Open the folder with the file you'd like to store your data in on your Yandex Disk
- Copy the URL from the address bar and append the file name to the URL (separated by a slash)
- Use the result URL as the `mv-source`/`mv-storage`/`mv-init` value.

**OR**

- Make the file public (by sharing it) and use the provided URL as the `mv-source`/`mv-storage`/`mv-init` value.

Done!

## Supported URLs

- `https://disk.yandex.com/client/disk/baz.json`—private file in the root of the disk
- `https://disk.yandex.com/client/disk/foo/bar/baz.json`—private file in a nested folder
- `https://disk.yandex.com/client/disk`—private file named `APP_ID.json` (where `APP_ID` is the name of your app) in the `mv-data` folder
- `https://disk.yandex.com/d/ahNF6_YRiAkeZA`—public (shared) file
- `https://disk.yandex.com/d/RJJgoQNFJlWO9Q/baz.json`—file in a public (shared) folder
- `https://disk.yandex.com/d/RJJgoQNFJlWO9Q/foo/bar/baz.json`—file in a subfolder of a public folder

**Note:** URLs starting with `https://disk.yandex.ru` are also supported.

**Warning:** Public files have download limits. The plugin will return the `404` (Not Found) error when you are out of limits.

## Supported [storage attributes](https://mavo.io/docs/storage#storage-attributes)

| Parameter  | Example            |
| ---------- | ------------------ |
| `filepath` | `foo/bar`          |
| `filename` | `baz.json`         |
| `path`     | `foo/bar/baz.json` |
