import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import Icon from '@/components/ui/icon'

interface Message {
  id: number
  user: string
  text: string
  avatar: string
  color: string
  title?: string
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Админ', text: 'Добро пожаловать в официальный чат FNANT!', avatar: '👑', color: '#22c55e', title: '[Фанат]' },
    { id: 2, user: 'Player1', text: 'Не могу дождаться релиза!', avatar: '🎮', color: '#3b82f6' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [hasFanTitle, setHasFanTitle] = useState(false)

  const news = [
    { 
      id: 1, 
      title: 'Анонс даты релиза!', 
      date: '15.02.2026', 
      text: 'Официальная дата выхода FNANT - 19 февраля 2026 года! Приготовьтесь к самому страшному хоррору года.' 
    },
    { 
      id: 2, 
      title: 'Новый трейлер доступен', 
      date: '10.02.2026', 
      text: 'Эксклюзивный трейлер уже на YouTube! Смотрите в разделе "Трейлер".' 
    },
    { 
      id: 3, 
      title: 'Открыта система титулов', 
      date: '01.02.2026', 
      text: 'Теперь вы можете получить эксклюзивный титул [Фанат] абсолютно бесплатно!' 
    },
  ]

  const faqItems = [
    { q: 'Что такое FNANT?', a: 'Five Nights at No Texture\'s - это инди-хоррор игра с уникальной атмосферой и геймплеем, вдохновленным классическими хоррорами.' },
    { q: 'Когда выйдет игра?', a: 'Официальный релиз запланирован на 19 февраля 2026 года.' },
    { q: 'На каких платформах будет доступна игра?', a: 'Игра выйдет на ПК (Windows), позже планируется выход на другие платформы.' },
    { q: 'Будут ли обновления после релиза?', a: 'Да! Мы планируем регулярные обновления с новым контентом и исправлениями.' },
    { q: 'Как получить титул [Фанат]?', a: 'Просто нажмите кнопку "Получить титул" в разделе "Титулы" и скопируйте его!' },
  ]

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: messages.length + 1,
      user: 'Вы',
      text: newMessage,
      avatar: '😎',
      color: '#a855f7',
      title: hasFanTitle ? '[Фанат]' : undefined
    }
    setMessages([...messages, msg])
    setNewMessage('')
  }

  const claimTitle = () => {
    setHasFanTitle(true)
    navigator.clipboard.writeText('[Фанат]')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-orbitron font-bold glow-text text-primary">FNANT</h1>
          <div className="flex gap-2 flex-wrap">
            {['home', 'news', 'trailer', 'faq', 'chat', 'titles'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                onClick={() => setActiveSection(section)}
                className={`font-orbitron ${activeSection === section ? 'glow-border' : ''}`}
              >
                {section === 'home' && 'Главная'}
                {section === 'news' && 'Новости'}
                {section === 'trailer' && 'Трейлер'}
                {section === 'faq' && 'FAQ'}
                {section === 'chat' && 'Чат'}
                {section === 'titles' && 'Титулы'}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-12">
        {activeSection === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-orbitron font-black glow-text">
                Five Nights at No Texture's
              </h2>
              <p className="text-xl text-muted-foreground">
                Приготовьтесь к незабываемому хоррор-опыту
              </p>
              <div className="flex gap-4 justify-center items-center flex-wrap">
                <Badge className="text-lg px-4 py-2 bg-primary glow-border font-orbitron">
                  Релиз: 19.02.2026
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2 font-orbitron">
                  2026
                </Badge>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl mb-8">
              <img 
                src="https://cdn.poehali.dev/projects/d893684c-7cd3-4963-a519-ce9494fdef47/files/653cc1de-1459-409b-9715-8a64aedb7466.jpg" 
                alt="FNANT Atmosphere"
                className="w-full h-[400px] object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            </div>

            <Card className="glass-panel p-8 glow-border">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-orbitron font-bold text-primary">О игре</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    FNANT - это уникальный хоррор-проект, который перенесет вас в мир текстурного кошмара. 
                    Пять ночей, полных напряжения, неожиданностей и страха. Сможете ли вы пережить все ночи?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => setActiveSection('trailer')} className="glow-border">
                      <Icon name="Play" className="mr-2" />
                      Смотреть трейлер
                    </Button>
                    <Button onClick={() => setActiveSection('chat')} variant="outline">
                      <Icon name="MessageCircle" className="mr-2" />
                      Присоединиться к чату
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-orbitron font-bold text-primary">Особенности</h3>
                  <div className="grid gap-3">
                    {[
                      { icon: 'Zap', text: 'Уникальная атмосфера' },
                      { icon: 'Gamepad2', text: 'Захватывающий геймплей' },
                      { icon: 'Users', text: 'Активное сообщество' },
                      { icon: 'Award', text: 'Система достижений' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 glass-panel rounded-lg">
                        <Icon name={feature.icon} className="text-primary" size={24} />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-orbitron font-bold glow-text">Новости</h2>
            <div className="grid gap-6">
              {news.map((item) => (
                <Card key={item.id} className="glass-panel p-6 glow-border hover:scale-[1.02] transition-transform">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <h3 className="text-2xl font-orbitron font-bold text-primary">{item.title}</h3>
                    <Badge variant="outline" className="font-orbitron">{item.date}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'trailer' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-orbitron font-bold glow-text">Трейлер</h2>
            <Card className="glass-panel p-8 glow-border">
              <div className="aspect-video w-full max-w-4xl mx-auto">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/1eClGnH2Lqk"
                  title="FNANT Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-xl text-muted-foreground">
                  Погрузитесь в атмосферу FNANT уже сейчас!
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-orbitron font-bold glow-text">FAQ</h2>
            <Card className="glass-panel p-6 glow-border">
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-primary/20">
                    <AccordionTrigger className="text-lg font-orbitron hover:text-primary">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        )}

        {activeSection === 'chat' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-orbitron font-bold glow-text">Чат сообщества</h2>
            <Card className="glass-panel glow-border">
              <ScrollArea className="h-[500px] p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 p-3 glass-panel rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="text-3xl">{msg.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-orbitron font-bold" style={{ color: msg.color }}>
                            {msg.user}
                          </span>
                          {msg.title && (
                            <Badge className="bg-primary/20 text-primary glow-border text-xs">
                              {msg.title}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-primary/20">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Введите сообщение..."
                    className="glass-panel border-primary/20"
                  />
                  <Button onClick={sendMessage} className="glow-border">
                    <Icon name="Send" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'titles' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-orbitron font-bold glow-text">Титулы</h2>
            <Card className="glass-panel p-8 glow-border max-w-2xl mx-auto text-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-orbitron font-bold text-primary">Эксклюзивный титул [Фанат]</h3>
                  <p className="text-muted-foreground">
                    Получите бесплатный титул настоящего фаната FNANT!
                  </p>
                </div>
                
                <div className="p-6 glass-panel rounded-lg glow-border inline-block">
                  <Badge className="text-2xl px-6 py-3 bg-primary glow-border animate-glow-pulse font-orbitron">
                    [Фанат]
                  </Badge>
                </div>

                {!hasFanTitle ? (
                  <Button 
                    onClick={claimTitle} 
                    size="lg" 
                    className="glow-border font-orbitron text-lg"
                  >
                    <Icon name="Award" className="mr-2" />
                    Получить титул
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Icon name="CheckCircle2" size={24} />
                      <span className="font-orbitron font-bold">Титул получен и скопирован!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Теперь ваши сообщения в чате будут отмечены титулом [Фанат]
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <h4 className="font-orbitron font-bold">Преимущества титула:</h4>
                  <div className="grid gap-2">
                    {[
                      'Уникальный цвет ника в чате',
                      'Специальный значок рядом с именем',
                      'Статус настоящего фаната FNANT'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 justify-center">
                        <Icon name="Star" className="text-primary" size={16} />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-primary/20 glass-panel mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            FNANT © 2026 | Five Nights at No Texture's
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Фан-сайт создан сообществом для сообщества
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Index