
export const generatePageStoreCode = () => `
const pageStore = {
  activePage: null,
  pages: new Map(),
  
  setActivePage(pageId, newPage) {
    this.pages.set(pageId, newPage);
    this.activePage = newPage;
    return newPage;
  },
  
  getPage(pageId) {
    return this.pages.get(pageId);
  },
  
  getCurrentPage() {
    return this.activePage;
  }
};`;
