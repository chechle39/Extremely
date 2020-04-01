import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

export class AppConsts {
  static readonly defaultDateFormat = 'DD/MM/YYYY';
  static readonly defaultDateFormatMM = 'MM/DD/YYYY';
  static readonly userManagement = {
    defaultAdminUserName: 'admin',
  };

  static readonly localization = {
    defaultLocalizationSourceName: 'Angular',
  };

  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token',
  };
  static readonly modalOptionsLargerSize: NgbModalOptions = {
    size: 'lg',
    centered: true,
    backdrop: 'static',
  };
  static readonly modalOptionsSmallSize: NgbModalOptions = {
    size: 'sm',
    centered: true,
    backdrop: 'static',
  };
  static readonly modalOptionsCustomSize: NgbModalOptions = {
    windowClass: 'mzModal',
    centered: true,
    backdrop: 'static',
  };
  static readonly modalOptionsCustomSizeX: NgbModalOptions = {
    windowClass: 'mzModalX',
    centered: true,
    backdrop: 'static',
  };
}
