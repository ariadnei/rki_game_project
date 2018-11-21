import pygame, sys
pygame.init()

SIZE = (1200, 750)
window = pygame.display.set_mode(SIZE)  # создаем окно
pygame.display.set_caption("Menu")  # заголовок окна
screen = pygame.Surface(SIZE)  # создаём игровую область


class Menu:
    def __init__(self, options = []):
        self.options = options
    def render(self, surface, font, num_opt):
        for i in self.options:
            if num_opt == i[5]:
                surface.blit(font.render(i[2], 1, i[4]), (i[0], i[1]))
            else:
                surface.blit(font.render(i[2], 1, i[3]), (i[0], i[1]))
    def menu(self):
        done = True
        font_menu = pygame.font.Font('fonts/nautilus.otf', 50)
        option = 0
        while done:
            screen.fill((0, 100, 200))

            mp = pygame.mouse.get_pos()  # координаты курсора мыши
            for i in self.options:
                if i[0] < mp[0] < i[0]+100 and i[1] < mp[1] < i[1]+40:
                    option = i[5]
            self.render(screen, font_menu, option)


            for e in pygame.event.get():
                if e.type == pygame.QUIT:
                    sys.exit()
                if e.type == pygame.KEYDOWN:
                    if e.key == pygame.K_ESCAPE:
                        sys.exit()
                    if e.key == pygame.K_UP:
                        if option > 0:
                            option -= 1
                    if e.key == pygame.K_DOWN:
                        if option < len(self.options)-1:
                            option += 1
                if pygame.mouse.get_pressed()[0] == 1:
                    if option == 0:
                        print('1')
                        done = False
                    if option == 1:
                        print('2')
                        done = False
                    if option == 2:
                        sys.exit()


            window.blit(screen, (0, 0))
            pygame.display.flip()


'''создаём меню'''

options = [(500, 140, u'1 Вариант', (250, 250, 30), (250, 30, 250), 0),
          (500, 210, u'2 Вариант', (250, 250, 30), (250, 30, 250), 1),
          (500, 290, u'3 Вариант', (250, 250, 30), (250, 30, 250), 2)]

game = Menu(options)
game.menu()
