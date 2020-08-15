<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface{

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event) 
    {
        // 1. J'ai besoin de trouver l'utilisateur actuellement connecté (Security)
        // Car je veux le numéro de la dernière facture pour cet utilisateur

        // 2. J'ai besoin du Repository des factures (InvoiceRepository)

        // 3. Choper la dernière facture insérée , et choper son chrono

        //4. Dans cette nouvelle facture, on donne le dernier chrono + 1

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($invoice instanceof Invoice && $method == 'POST') {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            // TODO: A déplacer dans une classe dédiée
            if(empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }
        }

    }
}