import { WordPressGeneratorSchema } from "../helpers";

export interface ThemeGeneratorSchema extends WordPressGeneratorSchema {
    name: string;
    parentTheme: string;
}
