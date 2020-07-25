<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    // Création d'une variable privée
    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    // Création d'un constructeur -> quand tu construis la Classe fixture, tu me passes un encodeur
    // Préciser mon encodeur -> celui qui implémente l'interface UserPasswordEncoder
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        // Mon encodeur = l'encodeur de Symfony
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        // Création d'une instance faker en faisant appel à la factory avec données FR
        $faker = Factory::create('fr_FR');

        for($u = 0; $u < 10; $u++) {
            $user = new User();

            $chrono = 1;

            // Création d'une variable hash et demander à l'encodeur de coder le password
            // On lui donne le mot de passe transformé pour le sécuriser
            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash); // On lui donne le password transformé
            
            $manager->persist($user);

             // Création de 30 clients en lui associant entre 3 et 10 factures
            for($c = 0; $c < mt_rand(5, 20); $c++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                        ->setLastName($faker->lastName)
                        ->setCompany($faker->company)
                        ->setEmail($faker->email)
                        ->setUser($user);

                // Faire persister les données dans la BDD
                $manager->persist($customer);

                for($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);

                    $chrono++;
                    
                    $manager->persist($invoice);
                }
            }
        }


        $manager->flush();
    }
}
