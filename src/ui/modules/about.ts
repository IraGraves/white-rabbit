/**
 * @file about.ts
 * @description About section displaying project branding and GitHub repository link.
 *
 * This small module creates an About folder in the main menu with the White Rabbit logo and
 * a link to the project's GitHub repository for user reference and contribution access.
 */

interface SimpleGUI {
  addFolder(name: string): {
    domElement: HTMLElement;
    close(): void;
  };
}

export function setupAboutFolder(gui: SimpleGUI | any): void {
  const aboutFolder = gui.addFolder('About');
  const aboutDiv = document.createElement('div');
  aboutDiv.style.padding = '15px';
  aboutDiv.style.textAlign = 'center';
  aboutDiv.innerHTML = `
        <img src="./assets/images/WhiteRabbit.png" style="max-width: 100%; margin-bottom: 10px; border-radius: 4px;">
        <br>
        <a href="https://github.com/IraGraves/white-rabbit" target="_blank" style="color: #88ccff; text-decoration: none;">GitHub Repository</a>
    `;
  aboutFolder.domElement.querySelector('.children').appendChild(aboutDiv);
  aboutFolder.close();
}
