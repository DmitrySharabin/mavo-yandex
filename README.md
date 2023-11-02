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
- `https://disk.yandex.com/d/RJJgoQNFJlWO9Q/foo/bar`—file named `APP_ID.json` (where `APP_ID` is the name of your app) in a subfolder of a public folder

**Note:** URLs starting with `https://disk.yandex.ru` are also supported.

**Warning:** Public files have download limits. The plugin will return the `404` (Not Found) error when you are out of limits.

## Storing data and uploading files

**Note:** You must log in to your Yandex account to save data and upload files.

In most cases, if you read data from the existing file (optionally located in a folder on your Yandex disk), the plugin will store your data in the same file (in the same folder).

However, there might be cases when you don't have a file with data on your Yandex disk yet. The plugin will try to create the file on saving for you in those cases.

Suppose you provided `https://disk.yandex.com/client/disk` as the `mv-storage` value. And you don't have a default `mv-data` folder on your Yandex disk with the file `APP_ID.json`, where `APP_ID` is the name of your app, in it. On saving data, the plugin will automatically create the `mv-data` folder with the `APP_ID.json` file to store your data in. Similarly, the plugin will create folder `foo` with the `bar.json` file if they don't exist and you provided `https://disk.yandex.com/client/disk/foo/bar.json` as the `mv-storage` value.

**Warning:** If you try to store your data in the `baz.json` file inside the `bar` subfolder of the `foo` folder (i.e., you provided `https://disk.yandex.com/client/disk/foo/bar/baz.json` as the `mv-storage` value), and `foo` **doesn't exist**, you'll get an error. The plugin _can not create nested folders_. That might change in the future, though. 😉

The same rules are applied when you try to upload your files.

## Supported [storage attributes](https://mavo.io/docs/storage#storage-attributes)

| Parameter  | Example            |
| ---------- | ------------------ |
| `filepath` | `foo/bar`          |
| `filename` | `baz.json`         |
| `path`     | `foo/bar/baz.json` |

## [Localization strings](https://mavo.io/docs/ui#localization)

| id              | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| `yandex-log-in` | `Please log in to your account to store your data and upload files.` |
