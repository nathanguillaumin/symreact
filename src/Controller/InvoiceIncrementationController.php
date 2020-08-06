<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;

// La classe doit avoir le même nom que le fichier en Symfony
class InvoiceIncrementationController {

        
    /** @var EntityManagerInterface */
    private $manager; 


    // // J'envoie dans la BDD avec une injection de dépendance
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }
    // On va recevoir une invoice (appel à l'entité Invoice)
    // Attention, la donnée doit s'appeler $data et pas autrement
    public function __invoke(Invoice $data)
    {
        // augmente le chrono de + 1
        $data->setChrono($data->getChrono() + 1);
        // dd = dump and die, fonction permettant de tester le contenu d'une variable
        $this->manager->flush();
        
        return $data;
    }
}