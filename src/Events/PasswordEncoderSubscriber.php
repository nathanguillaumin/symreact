<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    private $encoder;

    //injection de dépendance
    /** @var UserPasswordEncoderInterface */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        return [
            // On appelle le gestionnaire d'event Kernel avec le type d'event
            // Ensuite, en premier le nom de la fonction qu'on veut appeler
            // Ensuite la priorité que l'on veut donner: ici, on appelera encodePassword avant l'écriture dans la BDD
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    // On crée donc cette fonction en lui passant l'event implémentant la classe ViewEvent (voir doc)
    public function encodePassword(ViewEvent $event) {
        // On veut récupérer le résultat du controller => le JSON récupéré après désérialisation
        $result = $event->getControllerResult();
        // On récupère la requête HTTP en entier, et sa méthode
        $method = $event->getRequest()->getMethod(); // POST, GET, PUT ...
        
        // Je ne veux utiliser cette fonction que lors de la création d'un user, j'instancie donc la classe
        // Je veux aussi seulement l'utiliser lors du POST
        if($result instanceof User && $method === "POST") {
            $hash = $this->encoder->encodePassword($result, $result->getPassword());
            $result->setPassword($hash);
        }
    }
}
