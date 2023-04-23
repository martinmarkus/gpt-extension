export class ValidationRegexConstants {
  static readonly RequiredRegex: string = '^.{1,}$';

  static readonly PasswordRegex: string =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';

  static readonly EmailRegex: string = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';

}
