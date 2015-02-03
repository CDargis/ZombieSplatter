define(['lib/box2dWeb'],
	function() {
		var createPhysicsEngine = function() {
			var b2Vec2 = Box2D.Common.Math.b2Vec2
       	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
       	,	b2Body = Box2D.Dynamics.b2Body
       	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
       	,	b2Fixture = Box2D.Dynamics.b2Fixture
        , b2FilterData = Box2D.Dynamics.b2FilterData
       	,	b2World = Box2D.Dynamics.b2World
       	,	b2MassData = Box2D.Collision.Shapes.b2MassData
       	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
       	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
       	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
       	, b2Transform = Box2D.Common.Math.b2Transform
       	, b2Mat22 = Box2D.Common.Math.b2Mat22
        , b2Listener = Box2D.Dynamics.b2ContactListener;
        ;

			var engine = {
        SCALE: 30.0,
				world: {},
				init: function(entities) {
					engine.world = new b2World(new b2Vec2(0, 0), true)

          // Ground
          var groundPhysBodyDef = {
            density: 1.0,
            friction: .5,
            restitution: .2,
            halfWidth: 375,
            halfHeight: 15,
            groupIndex: null,
            pos: { x: 375, y: 390},
            type: 'static',
            userData: {
              'id': 'ground',
              'entity': null
            }
          };
          engine.addBody(groundPhysBodyDef);

          // Walls
          var wallPhysBodyDef = {
            density: 1.0,
            friction: .5,
            restitution: .2,
            halfWidth: 15,
            halfHeight: 200,
            groupIndex: null,
            pos: { x: 15, y: 200},
            type: 'static',
            userData: {
              'id': 'wall',
              'entity': null
            }
          };
          engine.addBody(wallPhysBodyDef);
          wallPhysBodyDef.pos.x = 735;
          wallPhysBodyDef.pos.y = 200;
          engine.addBody(wallPhysBodyDef);

          // Listener
          var listener = new b2Listener;
          listener.PostSolve = function (contact, impulse) {
            engine.postSolve(contact.GetFixtureA().GetBody(),
                      contact.GetFixtureB().GetBody(),
                      impulse.normalImpulses[0])
          }
          engine.world.SetContactListener(listener);

         	//setup debug draw
          var debugDraw = new b2DebugDraw();
					debugDraw.SetSprite(document.getElementById('debugCanvas').getContext('2d'));
					debugDraw.SetDrawScale(engine.SCALE);
					debugDraw.SetFillAlpha(0.7);
					debugDraw.SetLineThickness(1.0);
					debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
					engine.world.SetDebugDraw(debugDraw);

				},
        postSolve: function (bodyA, bodyB, impulse) {
          var uA = bodyA ? bodyA.GetUserData() : null;
          var uB = bodyB ? bodyB.GetUserData() : null;

          if(uA !== null) {
            entityA = uA.entity;
            if(entityA !== null && entityA.onTouch) {
              entityA.onTouch(bodyB, impulse);
            }
          }
          if(uB !== null) {
            entityB = uB.entity;
            if(entityB !== null && entityB.onTouch) {
              entityB.onTouch(bodyA, impulse);
            }
          }
        },
        addBody: function(physBodyDef) {
          var fixtureDef = new b2FixtureDef;
          fixtureDef.density = physBodyDef.density;
          fixtureDef.friction = physBodyDef.friction;
          fixtureDef.restitution = physBodyDef.restitution;
          fixtureDef.shape = new b2PolygonShape;
          fixtureDef.shape.SetAsBox(physBodyDef.halfWidth / engine.SCALE,
            physBodyDef.halfHeight / engine.SCALE);
          var filter = new b2FilterData();
          filter.groupIndex = physBodyDef.groupIndex;
          fixtureDef.filter = filter;

          var bodyDef = new b2BodyDef;
          if(physBodyDef.type === 'dynamic') {
            bodyDef.type = b2Body.b2_dynamicBody;
          }
          else if(physBodyDef.type === 'kinematic') {
            bodyDef.type = b2Body.b2_kinematicBody;
          }
          else {
            bodyDef.type = b2Body.b2_staticBody;
          }
          bodyDef.position.Set(physBodyDef.pos.x / engine.SCALE, physBodyDef.pos.y / engine.SCALE);

          var body = engine.world.CreateBody(bodyDef);
          body.CreateFixture(fixtureDef);
          if(physBodyDef.userData) {
            body.SetUserData(physBodyDef.userData);
          }
          return body;
        },
				removeBody: function(body) {
					engine.world.DestroyBody(body);
				},
				update: function(actions) {
          var data = { actions: actions };

          // Step through the world
          engine.world.Step(
            1 / 60  //frame-rate
            ,10     //velocity iterations
            ,10     //position iterations
          );

          engine.world.DrawDebugData();
          engine.world.ClearForces();

          // Update all the physics bodies
          for (var body = engine.world.GetBodyList(); body; body = body.GetNext()) {
            var userData = body.GetUserData();
            if(userData) {
              var entity = userData.entity;
              if(entity) {
                entity.update(data);
              }
            }
          }
				},
			};
			return engine;
		};
		return createPhysicsEngine();
	}
);
