import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
            --generate <count>
                       <filepath>
                       <url>:            # генерирует <count> записей в TSV
        Примеры:

            ts-node ./dist/cli.js --version

            ts-node ./dist/cli.js --generate 10 ./mocks/films.tsv http://localhost:3333/api

            ts-node ./dist/cli.js --import ./mocks/films.tsv
        `);
  }
}
