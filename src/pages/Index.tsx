import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import Icon from '@/components/ui/icon'

const CHAT_API = 'https://functions.poehali.dev/40f65b49-7c40-4f4f-89b7-d57d75ddf17c'

interface Message {
  id: number
  username: string
  message: string
  avatar: string
  color: string
  title?: string | null
  created_at?: string
}

const AVATARS = ['😎', '🎮', '👾', '🤖', '💀', '🔥', '⚡', '🎭', '🦊', '🐺']
const COLORS = ['#a855f7', '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#06b6d4', '#f97316']

const playClick = () => {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 800
  osc.type = 'sine'
  gain.gain.value = 0.1
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
  osc.stop(ctx.currentTime + 0.1)
}

const playSend = () => {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 600
  osc.type = 'triangle'
  gain.gain.value = 0.12
  osc.start()
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  osc.stop(ctx.currentTime + 0.2)
}

const playReceive = () => {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 1000
  osc.type = 'sine'
  gain.gain.value = 0.06
  osc.start()
  osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
  osc.stop(ctx.currentTime + 0.15)
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [hasFanTitle, setHasFanTitle] = useState(false)
  const [userAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)])
  const [userColor] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)])
  const [isSending, setIsSending] = useState(false)
  const lastIdRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval>>()

  const news = [
    { id: 1, title: 'Анонс даты релиза!', date: '15.02.2026', text: 'Официальная дата выхода FNANT - 19 февраля 2026 года! Приготовьтесь к самому страшному хоррору года.' },
    { id: 2, title: 'Новый трейлер доступен', date: '10.02.2026', text: 'Эксклюзивный трейлер уже на YouTube! Смотрите в разделе "Трейлер".' },
    { id: 3, title: 'Открыта система титулов', date: '01.02.2026', text: 'Теперь вы можете получить эксклюзивный титул [Фанат] абсолютно бесплатно!' },
  ]

  const faqItems = [
    { q: 'Что такое FNANT?', a: 'Five Nights at No Texture\'s - это инди-хоррор игра с уникальной атмосферой и геймплеем, вдохновленным классическими хоррорами.' },
    { q: 'Когда выйдет игра?', a: 'Официальный релиз запланирован на 19 февраля 2026 года.' },
    { q: 'На каких платформах будет доступна игра?', a: 'Телефон, ПК (Windows 10-11 64-bit).' },
    { q: 'В игре будет мультиплеер?', a: 'Да, будет!' },
    { q: 'Будут ли обновления после релиза?', a: 'Да! Мы планируем регулярные обновления с новым контентом и исправлениями.' },
    { q: 'Как получить титул [Фанат]?', a: 'Просто нажмите кнопку "Получить титул" в разделе "Титулы" и скопируйте его!' },
  ]

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${CHAT_API}?after_id=${lastIdRef.current}`)
      const data = await res.json()
      if (data.messages && data.messages.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMsgs = data.messages.filter((m: Message) => !existingIds.has(m.id))
          if (newMsgs.length > 0) {
            if (prev.length > 0) playReceive()
            lastIdRef.current = Math.max(...data.messages.map((m: Message) => m.id))
            return [...prev, ...newMsgs]
          }
          return prev
        })
      }
    } catch (e) {
      console.error('Chat fetch error:', e)
    }
  }, [])

  useEffect(() => {
    if (activeSection === 'chat') {
      fetchMessages()
      pollingRef.current = setInterval(fetchMessages, 2000)
      return () => clearInterval(pollingRef.current)
    } else {
      clearInterval(pollingRef.current)
    }
  }, [activeSection, fetchMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !username.trim() || isSending) return
    setIsSending(true)
    playSend()

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          message: newMessage.trim(),
          avatar: userAvatar,
          color: userColor,
          title: hasFanTitle ? '[Фанат]' : null
        })
      })
      const msg = await res.json()
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev
        lastIdRef.current = Math.max(lastIdRef.current, msg.id)
        return [...prev, msg]
      })
      setNewMessage('')
    } catch (e) {
      console.error('Send error:', e)
    } finally {
      setIsSending(false)
    }
  }

  const handleNav = (section: string) => {
    playClick()
    setActiveSection(section)
  }

  const claimTitle = () => {
    playClick()
    setHasFanTitle(true)
    navigator.clipboard.writeText('[Фанат]')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-orbitron font-bold glow-text text-primary cursor-pointer" onClick={() => handleNav('home')}>FNANT</h1>
          <div className="flex gap-2 flex-wrap">
            {['home', 'news', 'trailer', 'faq', 'chat', 'titles'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                onClick={() => handleNav(section)}
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
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://i.ytimg.com/vi/VrZF2H6gMnQ/maxresdefault.jpg"
                alt="FNANT"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-orbitron font-black glow-text">
                  Five Nights at No Texture's
                </h2>
                <p className="text-xl text-gray-300">
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
                    <Button onClick={() => handleNav('trailer')} className="glow-border">
                      <Icon name="Play" className="mr-2" />
                      Смотреть трейлер
                    </Button>
                    <Button onClick={() => handleNav('chat')} variant="outline">
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

            {!username.trim() ? (
              <Card className="glass-panel p-8 glow-border max-w-md mx-auto text-center space-y-4">
                <h3 className="text-xl font-orbitron font-bold text-primary">Введите ваше имя</h3>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && username.trim() && playClick()}
                  placeholder="Ваш ник..."
                  className="glass-panel border-primary/20 text-center text-lg"
                  maxLength={50}
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{userAvatar}</span>
                  <span style={{ color: userColor }} className="font-orbitron font-bold">{username || '...'}</span>
                  {hasFanTitle && <Badge className="bg-primary/20 text-primary text-xs">[Фанат]</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">Введите имя и нажмите Enter чтобы войти в чат</p>
              </Card>
            ) : (
              <Card className="glass-panel glow-border">
                <div className="p-3 border-b border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{userAvatar}</span>
                    <span style={{ color: userColor }} className="font-orbitron font-bold text-sm">{username}</span>
                    {hasFanTitle && <Badge className="bg-primary/20 text-primary text-xs">[Фанат]</Badge>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setUsername('')} className="text-xs">
                    <Icon name="LogOut" size={14} className="mr-1" />
                    Сменить ник
                  </Button>
                </div>
                <ScrollArea className="h-[450px] p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Чат пуст. Напишите первое сообщение!</p>
                    )}
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3 p-3 glass-panel rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="text-3xl">{msg.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-orbitron font-bold" style={{ color: msg.color }}>
                              {msg.username}
                            </span>
                            {msg.title && (
                              <Badge className="bg-primary/20 text-primary glow-border text-xs">
                                {msg.title}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{msg.message}</p>
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
                      maxLength={500}
                      disabled={isSending}
                    />
                    <Button onClick={sendMessage} className="glow-border" disabled={isSending}>
                      <Icon name="Send" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
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
