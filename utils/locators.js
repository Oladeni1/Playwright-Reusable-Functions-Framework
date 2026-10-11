import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  loginPage: {

    url: 'https://publishing.eks.dp.aws.onsdigital.uk/wagtail-admin/',
    usernameInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    loginButton: 'button[type="submit"]',
  },
  homePage: {
    pageHeader: '//body/div[2]/main/div/div[2]/header/div[1]/h1',
    loadPages: '//body/div[2]/main/div/div[2]/header/div[1]/section/ul/li[1]/a',
    searchBox: '//body/div[2]/main/div/div[2]/header/div/form/div[1]/div/div[3]/input',
    searchResults: '//body/div[2]/main/div/div[3]/form/table/tbody/tr[2]/td[2]/div/a/span',
    expectedUrl: 'https://publishing.eks.dp.aws.onsdigital.uk/wagtail-admin/pages/1/?q=theme',
    PageHeaderText: 'Office for National Statistics',
    searchBoxText: 'theme'

  },
  onsHomePage: {
    url_ons_stg: 'https://www.staging.onsdigital.co.uk/',
    onsLogo: '//body/header/div[2]/div/div[1]/a/img'

  }
};
